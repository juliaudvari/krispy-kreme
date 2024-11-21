export async function GET(req, res) {
  // Make a note we are on
  // the api. This goes to the console.

  console.log("in the weather api page");

  const res2 = await fetch(
    "http://api.weatherapi.com/v1/current.json?key=b2cab3cb3ca54f5fbf6133723242210&q=Dublin&aqi=no"
  );

  const data = await res2.json();

  console.log(data.current.temp_c);

  let currentTemp = data.current.temp_c;

  // Send the response back
  return new Response(JSON.stringify({ temp: currentTemp }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
