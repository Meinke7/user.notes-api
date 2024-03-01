const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('links', function(table) {
    table.increments('id');
    table.text('url').notNullable();
    table.integer('note_id').references('id').inTable('notes').onDelete("CASCADE");
    able.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('links');
};