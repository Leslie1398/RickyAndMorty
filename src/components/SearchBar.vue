<template>
  <div class="input-group w-25 mb-3">
    <input type="text" class="form-control" :value="modelValue"
      @input="updateValue"
      placeholder="Buscar personaje..."/>

    <button class="btn btn-sm btn-success">
      <i class="bi bi-search text-white"></i>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>