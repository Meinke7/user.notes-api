const knex = require('knex');
exports.up = function(knex) {
  return knex.schema.createTable('tags', function(table) {
    table.increments('id');
    table.text('name').notNullable();
    table.integer('note_id').references('id').inTable('notes').onDelete("CASCADE");
    table.integer('user_id').references('id').inTable('users');
    
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tags');
};