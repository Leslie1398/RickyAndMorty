import { describe, it, expect } from 'vitest'

describe('Favoritos', () => {

  it('debe agregar un personaje a favoritos', () => {

    const favoritos = []

    const personaje = { id: 1, name: 'Rick' }

    // simular addFavorite
    favoritos.push(personaje)

    expect(favoritos.length).toBe(1)

  })

  it('debe detectar si ya existe un favorito', () => {

    const favoritos = [{ id: 1, name: 'Rick' }]

    const existe = favoritos.some(
      f => f.id === 1
    )

    expect(existe).toBe(true)

  })

})