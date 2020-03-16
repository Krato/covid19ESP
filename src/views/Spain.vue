<template>
  <div class="container mx-auto px-4">
    <country-details />
  </div>
</template>
<script>
import CountryDetails from '@/components/CountryDetails.vue'

export default {
	name: 'Home',
	components: {
		CountryDetails
	}
}
</script>