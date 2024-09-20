<template>
  <section>
    <Table>
      <div class="h-full overflow-y-scroll">
        <div class="table bg-mainbg_300 rounded-t-2xl">
          <p>سرور</p>
          <p>دوره</p>
          <p>عمل</p>
        </div>
        <div class="table items">
          <p class="font-semibold">daniel.v4.myts3.ir</p>
          <p>15 Jan. 2023</p>
          <div class="flex gap-4">
            <img
              class="cursor-pointer w-8 h-8"
              src="/images/arrow-up.png"
              alt=""
            />
            <img
              class="cursor-pointer w-8 h-8"
              src="/images/trash.png"
              @click="(deleteDomainTab = true), (selectedDomain = domain)"
            />
          </div>
        </div>
      </div>
    </Table>
  </section>
</template>
<script setup>
import Table from '~/components/reusable/table.vue';
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  justify-items: center;
  padding: 1rem;
}
</style>
