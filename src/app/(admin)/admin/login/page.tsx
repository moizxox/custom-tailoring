import LoginForm from "./LoginForm";

type SearchParams = Promise<{ error?: string; callbackUrl?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  return (
    <LoginForm
      errorParam={params.error}
      callbackUrl={params.callbackUrl ?? "/admin"}
    />
  );
}
