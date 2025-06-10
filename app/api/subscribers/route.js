import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Subscriber from "@/lib/models/Subscriber";

// GET all subscribers
export async function GET() {
    try {
        await connectDB();
        const subscribers = await Subscriber.find({})
            .sort({ subscribedAt: -1 }); // Sort by newest first

        return NextResponse.json({
            success: true,
            subscribers
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch subscribers'
        }, { status: 500 });
    }
}

// POST new subscriber
export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectDB();

        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            if (existingSubscriber.status === 'unsubscribed') {
                // Reactivate subscription
                existingSubscriber.status = 'active';
                await existingSubscriber.save();
                return NextResponse.json({
                    success: true,
                    message: 'Subscription reactivated successfully'
                });
            }
            return NextResponse.json({
                success: false,
                message: 'Email already subscribed'
            }, { status: 400 });
        }

        // Create new subscriber
        const subscriber = await Subscriber.create({ email });

        return NextResponse.json({
            success: true,
            message: 'Subscribed successfully',
            subscriber
        });
    } catch (error) {
        console.error('Error creating subscriber:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to subscribe'
        }, { status: 500 });
    }
}

// DELETE subscriber
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await connectDB();
        const subscriber = await Subscriber.findById(id);

        if (!subscriber) {
            return NextResponse.json({
                success: false,
                message: 'Subscriber not found'
            }, { status: 404 });
        }

        await subscriber.deleteOne();

        return NextResponse.json({
            success: true,
            message: 'Subscriber removed successfully'
        });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to remove subscriber'
        }, { status: 500 });
    }
}

// PATCH update subscriber status
export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { status } = await req.json();

        await connectDB();
        const subscriber = await Subscriber.findById(id);

        if (!subscriber) {
            return NextResponse.json({
                success: false,
                message: 'Subscriber not found'
            }, { status: 404 });
        }

        subscriber.status = status;
        await subscriber.save();

        return NextResponse.json({
            success: true,
            message: 'Subscriber status updated successfully',
            subscriber
        });
    } catch (error) {
        console.error('Error updating subscriber:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update subscriber'
        }, { status: 500 });
    }
} 