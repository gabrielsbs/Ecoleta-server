/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Knex from 'knex'
export const up = async (knex: Knex) => {
  return knex.schema.createTable('point_item', table => {
    table.increments('id').primary()
    table.integer('point_id').unsigned().references('id').inTable('points').notNullable()
    table.integer('item_id').references('id').inTable('items').notNullable()
  })
}

export const down = async (knex: Knex) => {
  return knex.schema.dropTable('point_item')
}
