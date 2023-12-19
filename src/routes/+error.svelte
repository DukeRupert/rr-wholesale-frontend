<script lang="ts">
    import { page } from '$app/stores';
    import { PUBLIC_TECH_SUPPORT_EMAIL } from '$env/static/public'

    let email = PUBLIC_TECH_SUPPORT_EMAIL ?? ""
    $: title = updateTitle($page.status)

    function updateTitle(status: number) {
        switch (status) {
            case 404:
                return "Page not found"
            case 500:
                return "An error has occured"
            default:
                "Page not found";
        }
    }
</script>

<section class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold text-thunderbird-600">{$page.status}</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1>
    <!-- <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p> -->
    <p class="mt-6 text-base leading-7 text-gray-600">{$page.error?.message}</p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a href="/" class="btn">Go back home</a>
      <a href={"mailto:" + email} class="text-sm font-semibold text-gray-900">Contact support <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</section>
