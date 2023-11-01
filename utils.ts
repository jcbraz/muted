import { AccountFollowingFeedResponseUsersItem, Feed, IgApiClient } from "instagram-private-api";
/**
 * 
 * @param feed - Instagram Feed
 * @returns items - Array of items from a specific Instagram Feed (followers for example)
 */
export async function getAllItemsFromFeed<T>(feed: Feed<any, T>): Promise<T[]> {
    let items: T[] = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}

/**
 * Function to wait a random amount of time before sending a request to Instagram API - prevents from getting 402 error
 * @param max_seconds - Maximum seconds to wait before sending a request
 */
export async function waitBeforeRequest(max_seconds: number) {
    const time = Math.round(Math.random() * max_seconds * 1000) + 1000;
    await new Promise((resolve) => setTimeout(resolve, time));
};

/**
 * Mute all users you follow
 * @param instagram - Instagram API Client
 * @param notToMute - Optional array of users you don't want to mute
 * 
 */
export async function mute(instagram: IgApiClient, notToMute?: string[]) {
    console.log('Starting...');

    let mutedUsers: AccountFollowingFeedResponseUsersItem[] = [];

    await instagram.account.login(process.env.IG_USERNAME as string, process.env.IG_PASSWORD as string);

    const followingFeed = instagram.feed.accountFollowing(instagram.state.cookieUserId);

    let followingToMute = await getAllItemsFromFeed(followingFeed);
    if (notToMute) followingToMute = followingToMute.filter(user => !notToMute.includes(user.username));

    for (const user of followingToMute) {
        await waitBeforeRequest(90);
        await instagram.friendship.mutePostsOrStoryFromFollow({
            mediaId: undefined,
            targetReelAuthorId: user.pk.toString(),
            targetPostsAuthorId: user.pk.toString(),
        });
        console.log(`Muted ${user.username}`);
        mutedUsers.push(user);

        const time = Math.round(Math.random() * 6000) + 1000;
        await new Promise(resolve => setTimeout(resolve, time));
    };
}

/**
 * Retry to mute all users you follow if Instagram API returns an excessive amount of requests error
 * @param instagram - Instagram API Client
 * @param mutedUsers - Array of users already muted
 * @param notToMute - Optional array of users you don't want to mute
 */
export async function retryMute(instagram: IgApiClient, mutedUsers: AccountFollowingFeedResponseUsersItem[], notToMute?: string[]) {
    console.log('Retrying...');

    await instagram.account.login(process.env.IG_USERNAME as string, process.env.IG_PASSWORD as string);

    const followingFeed = instagram.feed.accountFollowing(instagram.state.cookieUserId);

    let followingToMute = await getAllItemsFromFeed(followingFeed);
    if (notToMute) followingToMute = followingToMute.filter(user => !notToMute.includes(user.username));

    const usersToMute = followingToMute.filter(user => !mutedUsers.includes(user));

    for (const user of usersToMute) {
        await instagram.friendship.mutePostsOrStoryFromFollow({
            mediaId: undefined,
            targetReelAuthorId: user.pk.toString(),
            targetPostsAuthorId: user.pk.toString(),
        });
        console.log(`Muted ${user.username}`);
        mutedUsers.push(user);
    };
}