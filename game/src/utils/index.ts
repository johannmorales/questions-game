function getLetterFromIndex(index: number): string {
  return "ABCD".charAt(index);
}

  function callAction(path: string, body?: any) {
    console.log(import.meta.env.VITE_BACKEND_URL, path, body);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    });
  }
  export { getLetterFromIndex, callAction };

