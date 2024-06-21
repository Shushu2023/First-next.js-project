'use server';// mark all the exported functions within the file as server functions can then be imported into Client and Server components, making them extremely versatile
 
import { z } from 'zod';//TypeScript-first validation library  handle type validation
import { sql } from '@vercel/postgres';//
import { revalidatePath } from 'next/cache';//revalidatePath function from Next.j to clear the Client-side Router Cache and trigger a new request to the server
import { redirect } from 'next/navigation'; // redirect function from Next.js:

//define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),// amount field is specifically set to coerce (change) from a string to a number while also validating its type
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  });

  const CreateInvoice = FormSchema.omit({ id: true, date: true });

//async function that accepts formData
export async function createInvoice(formData: FormData) {
    //pass your rawFormData to CreateInvoice to validate the types
        const { customerId, amount, status } = CreateInvoice.parse({
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
          });
          const amountInCents = amount * 100;//convert the amount into cents to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
          const date = new Date().toISOString().split('T')[0]; //create a new date with the format "YYYY-MM-DD" for the invoice's creation date
       
          // create an SQL query to insert the new invoice into your database and pass in the variables
          await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;

          revalidatePath('/dashboard/invoices'); //revalidatePath function from Next.j to clear the Client-side Router Cache and trigger a new request to the server
                                                 //Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.

         redirect('/dashboard/invoices'); //redirect the user back to the /dashboard/invoices page
        };
      