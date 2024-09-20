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
          <p>هفتگی</p>
          <img
            class="cursor-pointer"
            src="/images/trash.png"
            alt=""
            @click="(deleteDomainTab = true), (selectedDomain = domain)"
          />
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
