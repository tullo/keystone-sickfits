import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false,
    read({ args, cache }, existing = []) {
      console.log({ existing, args, cache });
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1; // (0/1)+1 => 1
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If there are items
      //   AND we are on the last page
      //   AND there are not enough items to fill the last page
      if (items.length && items.length !== first && page === pages) {
        // Just send them to apollo
        return items;
      }

      if (items.length !== first) {
        // No items, let apollo fetch them over the network.
        return false;
      }

      // If there are items, just return them from the cache.
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache! Gonna send them to apollo`
        );
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip } = args;
      // this runs when the apollo client comes back from the network with our product
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];

      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
  };
}
