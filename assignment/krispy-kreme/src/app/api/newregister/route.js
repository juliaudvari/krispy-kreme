export async function GET(req, res) {
  // Make a note we are on
  // the api. This goes to the console.
  console.log("in the api page");
  // get the values
  // that were sent across to us.
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const pass = searchParams.get("pass");
  const address = searchParams.get("address");
  const telephoneNumber = searchParams.get("telephoneNumber");
  const secondEmail = searchParams.get("secondEmail");
  const secondPass = searchParams.get("secondPass");

  console.log(email);
  console.log(pass);
  console.log(address);
  console.log(telephoneNumber);
  console.log(secondEmail);
  console.log(secondPass);

  // database call goes here
  // at the end of the process we need to send something back.
  return Response.json({ data: "valid" });
}
