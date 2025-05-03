<template>
  <div>
    <Accordion value="0">
      <AccordionPanel value="0">
        <AccordionHeader
          ><h2 class="h2-katastar">
            Uređena zemlja
            <a
              href="https://oss.uredjenazemlja.hr/map"
              target="_blank"
              class="link-as-heading">
              <font-awesome-icon icon="up-right-from-square" />
            </a></h2
        ></AccordionHeader>
        <AccordionContent>
          <iframe
            :src="selectedUrl"
            style="width: 100%; height: 800px; border: none" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import Accordion from "primevue/accordion";
import { ref } from "vue";

// Početni URL koji će biti prikazan
const selectedUrl = ref("https://oss.uredjenazemlja.hr/map");
</script>

<style scoped>
#pv_id_4_accordionheader_0.p-accordionheader {
    border-bottom: 1px solid var(--primary-color);
    border-radius: 0;
}
#pv_id_5_accordionheader_0.p-accordionheader {
    padding: 13px;
    border-radius: 0;
    /* border-bottom: 1px solid var(--primary-color); */
}
#pv_id_5_accordionheader_0.p-accordionheader:hover {
  background-color: rgb(248, 248, 248);
}
.p-accordionpanel {
    border-bottom: 1px solid var(--primary-color);
}
h2 {
  width: 100%;
  font-size: 18px;
  /* border-bottom: 1px solid var(--primary-color); */
  color: var(--primary-color);

  display: flex;
  align-items: center;
  gap: 13px;
}

a.link-as-heading {
  font-size: 18px;
  color: var(--primary-color);
  /* color: var(--primary-color); */
  text-decoration: none;
}

a.link-as-heading:hover {
  color: var(--primary-color-hover);
  transform: translate(3px, -3px);
}

label {
  margin-right: 15px;
  font-weight: bold;
}

iframe {
  margin-top: 20px;
}
</style>
