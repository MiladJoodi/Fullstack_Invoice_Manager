import { getInvoice, getInvoices } from "@/actions/invoiceActions";
import CreateInvoice from "@/components/involice/CreateInvoice";
import ListInvoice from "@/components/involice/ListInvoice";
import { Separator } from "@/components/ui/separator";

export default async function Home({searchParams}) {

  const search = searchParams?.search || "";
  const page = searchParams?.page || "";

  const res = await getInvoices({
    search,
    page,
    limit: 5
  });

  const invoices = JSON.parse(res) || [];

  console.log(invoices)

  return (
    <div className="flex justify-center min-h-[82vh]">
      <section className="w-full px-2 max-w-[1000px]">
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold">Invoice Manager</h3>
          <CreateInvoice />
        </div>

        <Separator className="my-2 border-b-[2px] border-color-light-blue" />
        <ListInvoice
        total={invoices.total}
        pageNumber={invoices.pageCount}
        invoices={invoices.data}
        />
      </section>
    </div>
  );
}
