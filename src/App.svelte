<script>
  import Router from "svelte-spa-router";
  import Home from "./home/Home.svelte";
  import Login from "./login/Login.svelte";

  const routes = {
    "/": Home,
    "/login": Login,
  };
</script>

<main>
  <Router {routes} />
</main>
