import Knex from 'knex'

export async function seed(knex:Knex){

    await knex('items').insert([
        {title :'Lanchonete', image: 'coffe.png'},
        {title :'Posto de Gasolina', image: 'gas.png'},
        {title :'Hotel', image: 'hotel.png'},
        {title :'Mecânico', image: 'mecanic.png'},
        {title :'Borracheiro', image: 'pitstop.png'},
        {title :'Estacionamento', image: 'park.png'}
    ])

}