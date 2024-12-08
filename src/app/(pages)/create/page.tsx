import { getSession } from "@/actions/getSession";
import CreateFrom from "@/components/CreateFrom";
import SetSession from "@/components/SetSession";

async function Page() {
  const user = await getSession();

  return (
    <>
      <SetSession user={user} />
      <CreateFrom />
    </>
  );
}

export default Page;
