const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('notes', function(table) {
    table.increments('id');
    table.text('title');
    table.text('description');
    
    table.integer('user_id').references('id').inTable('users');
    table.timestamps(true, true)
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notes');
};