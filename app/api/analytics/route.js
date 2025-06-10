import { connectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import Subscriber from "@/lib/models/Subscriber";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const timeRange = request.nextUrl.searchParams.get("range") || "7d";

        // Calculate date ranges for current and previous periods
        const endDate = new Date();
        const startDate = new Date();
        let previousStartDate = new Date();
        let previousEndDate = new Date();

        // Set date ranges based on selected period
        switch (timeRange) {
            case "365d": // 1 year
                startDate.setDate(startDate.getDate() - 365);
                previousStartDate.setDate(previousStartDate.getDate() - 730);
                previousEndDate.setDate(previousEndDate.getDate() - 365);
                break;
            case "180d": // 6 months
                startDate.setDate(startDate.getDate() - 180);
                previousStartDate.setDate(previousStartDate.getDate() - 360);
                previousEndDate.setDate(previousEndDate.getDate() - 180);
                break;
            case "90d": // Quarter
                startDate.setDate(startDate.getDate() - 90);
                previousStartDate.setDate(previousStartDate.getDate() - 180);
                previousEndDate.setDate(previousEndDate.getDate() - 90);
                break;
            case "30d": // Month
                startDate.setDate(startDate.getDate() - 30);
                previousStartDate.setDate(previousStartDate.getDate() - 60);
                previousEndDate.setDate(previousEndDate.getDate() - 30);
                break;
            default: // 7d (Week)
                startDate.setDate(startDate.getDate() - 7);
                previousStartDate.setDate(previousStartDate.getDate() - 14);
                previousEndDate.setDate(previousEndDate.getDate() - 7);
        }

        // Get posts data for both periods
        const [currentPosts, previousPosts] = await Promise.all([
            BlogModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
            }).countDocuments(),
            BlogModel.find({
                createdAt: { $gte: previousStartDate, $lte: previousEndDate }
            }).countDocuments()
        ]);

        // Get subscribers data for both periods
        const [currentSubscribers, previousSubscribers] = await Promise.all([
            Subscriber.find({
                subscribedAt: { $gte: startDate, $lte: endDate },
                status: 'active'
            }).countDocuments(),
            Subscriber.find({
                subscribedAt: { $gte: previousStartDate, $lte: previousEndDate },
                status: 'active'
            }).countDocuments()
        ]);

        // Get views data for both periods
        const blogs = await BlogModel.find({}).select('views viewsHistory');

        // Calculate current period views
        const currentViews = blogs.reduce((sum, blog) => {
            const viewsInPeriod = (blog.viewsHistory || [])
                .filter(view => view.date >= startDate && view.date <= endDate)
                .reduce((viewSum, view) => viewSum + view.count, 0);
            return sum + viewsInPeriod;
        }, 0);

        // Calculate previous period views
        const previousViews = blogs.reduce((sum, blog) => {
            const viewsInPeriod = (blog.viewsHistory || [])
                .filter(view => view.date >= previousStartDate && view.date <= previousEndDate)
                .reduce((viewSum, view) => viewSum + view.count, 0);
            return sum + viewsInPeriod;
        }, 0);

        // Calculate period-over-period changes
        const calculatePoP = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        // Get daily views and subscribers data for chart
        const dailyViews = await BlogModel.aggregate([
            {
                $unwind: "$viewsHistory"
            },
            {
                $match: {
                    "viewsHistory.date": { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$viewsHistory.date" }
                    },
                    views: { $sum: "$viewsHistory.count" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const dailySubscribers = await Subscriber.aggregate([
            {
                $match: {
                    subscribedAt: { $gte: startDate, $lte: endDate },
                    status: 'active'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" }
                    },
                    subscribers: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get recent posts with views
        const recentPostsList = await BlogModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title category views createdAt');

        // Get top categories
        const categories = await BlogModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    views: { $sum: "$views" }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 4
            }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    posts: {
                        current: currentPosts,
                        previous: previousPosts,
                        total: await BlogModel.countDocuments(),
                        change: calculatePoP(currentPosts, previousPosts)
                    },
                    subscribers: {
                        current: currentSubscribers,
                        previous: previousSubscribers,
                        total: await Subscriber.countDocuments({ status: 'active' }),
                        change: calculatePoP(currentSubscribers, previousSubscribers)
                    },
                    views: {
                        current: currentViews,
                        previous: previousViews,
                        total: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
                        change: calculatePoP(currentViews, previousViews)
                    }
                },
                periodInfo: {
                    current: {
                        start: startDate,
                        end: endDate
                    },
                    previous: {
                        start: previousStartDate,
                        end: previousEndDate
                    }
                },
                chartData: {
                    labels: [...new Set([...dailyViews.map(d => d._id), ...dailySubscribers.map(d => d._id)])].sort(),
                    views: dailyViews,
                    subscribers: dailySubscribers
                },
                recentPosts: recentPostsList,
                categories: categories
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
} 