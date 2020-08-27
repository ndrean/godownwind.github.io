import urlBack from "./urlBack";
export default fetchModif;

function returnUnauthorized() {
  alert("You can't modify other's events");
  throw new Error("not authorized");
}

async function fetchModif({ method, index, body, token }) {
  try {
    const query = await fetch(urlBack + "/events/" + index, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      index: index,
      body: body,
    });
    if (query.ok) {
      const response = await query.json();
      return response;
    } else {
      returnUnauthorized();
    }
  } catch (err) {
    console.log(err);
  }
}
