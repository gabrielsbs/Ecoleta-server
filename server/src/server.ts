import express from 'express'

const app = express()

app.get('/users', (request, response) => {
    console.log('Listagem de Usr')
    response.json( [
        'Julio',
        'Robs',
        'Fernanda',
        'Lula'
    ])
})

app.listen(3333)