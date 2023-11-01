import 'dotenv/config';
import { AccountFollowingFeedResponseUsersItem, IgApiClient, IgResponseError } from "instagram-private-api";
import { mute, retryMute } from './utils';

/**
 * Instagram API Client
 */
const instagram = new IgApiClient();

/**
 * Array of users you don't want to mute (change this array with your own usernames)
 *
 * @example
 * const notToMute: string[] = ['ig_username_1','ig_username_2'];
 */
const notToMute: string[] = [];

if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD) throw new Error('USERNAME and PASSWORD are required');

instagram.state.generateDevice(process.env.IG_USERNAME);

/**
 * Main function
 */
const run = async () => {
    let mutedUsers: AccountFollowingFeedResponseUsersItem[] = [];
    try {
        await mute(instagram, notToMute);
        console.log('End');
    } catch (err) {
        if (err instanceof IgResponseError) {
            await retryMute(instagram, mutedUsers, process.env.NOT_TO_MUTE?.split(','));
        } else {
            console.error(err);
        }
    }
}

/**
 * Run the main function
 */
run().then(() => console.log('Done'));