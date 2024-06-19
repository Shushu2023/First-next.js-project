'use client';// Client Component, which means you can use event listeners and hooks

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
export default function Search({ placeholder }: { placeholder: string }) {

  const searchParams = useSearchParams();//useSearchParams hook from 'next/navigation', and assign it to a variable
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    console.log(term);
    const params = new URLSearchParams(searchParams); // create a new URLSearchParams instance using your new searchParams variable
    params.set('page', '1');//when the user types a new search query, you want to reset the page number to 1
    //set the params string based on the user’s input. If the input is empty, you want to delete it:
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); //wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms).
  

  
//   const pathname = usePathname();
//   const { replace } = useRouter();
//   const handleSearch = useDebouncedCallback((term) => {
//     console.log(`Searching... ${term}`);

//     const params = new URLSearchParams(searchParams);//create a new URLSearchParams instance using your new searchParams variable.
//     //set the params string based on the user’s input. If the input is empty, you want to delete it
//     if (term) {
//       params.set('query', term);
//     } else {
//       params.delete('query');
//     }

//     /**${pathname} is the current path, in your case, "/dashboard/invoices".
// As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
// replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee".
// The URL is updated without reloading the page, thanks to Next.js's client-side navigation (which you learned about in the chapter on navigating between pages. */
    
// replace(`${pathname}?${params.toString()}`);
// }, 300);
   
  
 
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      {/*This is the search input*/}
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
         defaultValue={searchParams.get('query')?.toString()} //To ensure the input field is in sync with the URL and will be populated when sharing
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
