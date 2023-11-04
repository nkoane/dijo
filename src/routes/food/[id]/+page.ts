import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    console.log(params.id);

    const food = null;
    console.log('food/id/page.ts: food =', food);

    if (food == null) {
        throw error(404, `Food (${params.id}) not found`);
    }
    return {};
}) satisfies PageLoad;
