<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import SearchBar from './components/SearchBar.vue'

const getInfo = ref([])
const personajeSeleccionado = ref(null)
const busqueda = ref('')
const favoritos = ref([])
const mostrarFavoritos = ref(false)
const pagina = ref(1)
const porPagina = 8


function openModal(personaje) {
  personajeSeleccionado.value = personaje
}

function esFavorito(personaje) {
  console.log(favoritos)
  return favoritos.value.some(
    favorito => favorito.id === personaje.id
  )
}

function toggleFavorito(personaje) {

  if (esFavorito(personaje)) {

    favoritos.value = favoritos.value.filter(
      favorito => favorito.id !== personaje.id
    )

    Swal.fire({
      title: 'Eliminado',
      text: `${personaje.name} fue eliminado de favoritos`,
      icon: 'success',
      confirmButtonColor: '#dc3545'
    })

  } else {

    Swal.fire({
      title: '¿Agregar a favoritos?',
      text: `¿Deseas agregar a ${personaje.name} a favoritos?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#dc3545'

    }).then((result) => {

      if (result.isConfirmed) {

        favoritos.value.push(personaje)

        Swal.fire({
          title: 'Agregado',
          text: `${personaje.name} fue agregado a favoritos`,
          icon: 'success',
          confirmButtonColor: '#198754'
        })

      }

    })
  }
}

const personajesAMostrar = computed(() => {

  if (mostrarFavoritos.value) {
    return favoritos.value
  }

  return getInfo.value
})

const personajesFiltrados = computed(() => {
  let lista = personajesAMostrar.value

    if (busqueda.value.trim()) {
      lista = lista.filter(personaje =>
        personaje.name
          .toLowerCase()
          .includes(busqueda.value.toLowerCase())
      )
    }

    return lista
})

const personajesPaginados = computed(() => {

  const inicio = (pagina.value - 1) * porPagina
  const fin = inicio + porPagina

  return personajesFiltrados.value.slice(
    inicio,
    fin
  )

})

const totalPaginas = computed(() => {
  return Math.ceil(
    personajesFiltrados.value.length / porPagina
  )
})


onMounted(async ()=> {
  const characters = await 
   fetch('https://rickandmortyapi.com/api/character')

   const info = await characters.json()

   getInfo.value = info.results;

})
</script>

<template>

  <div class="text-center mb-2 mt-2">
    <h3 class="d-block">Ejercicio frontend</h3>
    <h3>Base de datos de personajes</h3>
  </div>

  <div class="d-flex justify-content-around mt-3 mb-2">
    <!--Search-->
    <SearchBar v-model="busqueda" />

    <button class="btn btn-light p-2"
        @click="mostrarFavoritos = !mostrarFavoritos">
      Mis favoritos ({{ favoritos.length }}) <i class="bi bi-star text-white" style="background-color: rgb(101, 39, 245);"></i>
    </button>
  </div>


  <div class="container text-center" >
    <div class="row row-cols-4 row-cols-lg-5 g-2 g-lg-3" v-if="!busqueda.trim()" id="showContentGeneral">
      <div class="col" v-for="personaje in personajesFiltrados"
        :key="personaje.id">
        <div class="card shadow rounded h-100">
            <div class="card-body text-center">
              <!--Img / abre modal-->
              <img :src="personaje.image" class="img-fluid" @click="openModal(personaje)"
                data-bs-toggle="modal" data-bs-target="#openModal" style="cursor:pointer;" />

              <div class="d-flex justify-content-between mt-1">
                <!--Personaje-->
                <span class="text-uppercase fw-bolder" style="font-size: 12px;" v-text="personaje.name"></span>

                <!--Agregar a favoritos-->
                <i class="bi" :class="esFavorito(personaje) ? 'bi-star-fill text-warning' : 'bi-star'"
                  @click="toggleFavorito(personaje)" style="cursor:pointer; font-size:25px;" ></i>
              </div>
            </div>
          </div>
      </div>
    </div>

    <!--Resultado de busqueda-->
    <div class="row" v-if="busqueda.trim()" id="resultCharacter">
       <div class="col-lg-3"  v-for="personaje in personajesFiltrados" :key="personaje.id">
        <div class="card shadow rounded-15 mb-5">
          <div class="card-body">
            <!--Img / abre modal-->
            <img :src="personaje.image" class="img-fluid" @click="openModal(personaje)"
                data-bs-toggle="modal" data-bs-target="#openModal" style="cursor:pointer;" />

              <div class="d-flex justify-content-between mt-1">
                <!--Personaje nombre-->
                <span class="text-uppercase fw-bolder" style="font-size: 12px;" v-text="personaje.name"></span>
                <!--Agregar a favoritos-->
                <i class="bi" :class="esFavorito(personaje) ? 'bi-star-fill text-warning' : 'bi-star'"
                  @click="toggleFavorito(personaje)" style="cursor:pointer; font-size:25px;" ></i>
                
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>

    <!--Paginador-->
    <div class="d-flex justify-content-center mt-4 mb-4">

      <button class="btn btn-secondary me-2" @click="pagina--" :disabled="pagina===1">
        Anterior
      </button>

      <span class="align-self-center">
        Página {{ pagina }} de {{ totalPaginas }}
      </span>

      <button class="btn btn-secondary ms-2" @click="pagina++" :disabled="pagina===totalPaginas">
        Siguiente
      </button>

    </div>

  <!--Informacion del personaje-->
  <div class="modal fade" id="openModal" data-bs-backdrop="static" 
  data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-end">
          <button id="btnCerrarModal" type="button" class="btn btn-outline-danger" 
                  data-bs-dismiss="modal" aria-label="Close"  style="border-radius:10%; padding:5px;">
                  Cerrar <i class="bi bi-x-lg text-danger"></i>
          </button>
        </div>
        <div class="modal-body text-center" v-if="personajeSeleccionado">

          <img :src="personajeSeleccionado.image"
            class="img-fluid mb-3">

          <h4 v-text="personajeSeleccionado.name"></h4>

          <div class="d-flex justify-content-around">
            <span class="badge text-bg-info bg-opacity-50 text-dark fs-6 me-2" v-text="'Estado: ' + personajeSeleccionado.status"></span>
            <span class="badge text-bg-primary bg-opacity-50 text-dark fs-6" v-text="'Genero: ' + personajeSeleccionado.gender"></span>
          </div>

          <div class="d-flex justify-content-around mt-1">
            <span class="badge text-bg-success bg-opacity-50 text-dark fs-6 me-2" v-text="'Especie: ' + personajeSeleccionado.species"></span>
            <span class="badge text-bg-warning bg-opacity-50 text-dark fs-6" v-text="'Origen: ' + personajeSeleccionado.origin.name"></span>
          </div>

          <div class="text-center mt-1">
            <span class="badge text-bg-warning bg-opacity-25 text-dark fs-6" v-text="'Ubicacion: ' + personajeSeleccionado.location.name"></span>
          </div> 

        </div>
      </div>
    </div>
  </div>
  
  
</template>
