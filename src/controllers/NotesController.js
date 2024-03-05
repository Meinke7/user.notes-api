const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, description, tags, user_rating } = request.body;
        const { user_id } = request.params;

        // Verificar se user_rating está dentro do intervalo válido (1 a 5)
        if (user_rating && (user_rating < 1 || user_rating > 5)) {
            return response.status(400).json({ error: 'A nota deve ser entre 1 e 5.' });
        }

        try {
            const [note_id] = await knex("notes").insert({
                title, 
                description,
                user_rating,
                user_id
            });
            
            const tagsInsert = tags.map(tag => {
                return {
                    note_id: note_id,
                    name: tag 
                };
            });

            await knex("tags").insert(tagsInsert);

            return response.status(201).json({ message: 'Nota criada com sucesso!' });
        } catch (error) {
            return response.status(500).json({ error: 'Ocorreu um erro ao criar a nota.' });
        }
    }
  
    async show(request, response) {
        const { id } = request.params;

        try {
            const note = await knex("notes").where({ id }).first();
            const tags = await knex("tags").where({ note_id: id }).orderBy("name");
          
            return response.json({
                ...note,
                tags
            });
        } catch (error) {
            return response.status(500).json({ error: 'Ocorreu um erro ao buscar a nota.' });
        }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            await knex("notes").where({ id }).delete();
            return response.status(204).send();
        } catch (error) {
            return response.status(500).json({ error: 'Ocorreu um erro ao deletar a nota.' });
        }
    }

    async index(request, response) {
        const { title, user_id, tags, user_rating } = request.query;

        let notes; 
        try {
            if (tags) {
                const filterTags = tags.split(',').map(tag => tag.trim());

                notes = await knex("tags")
                    .select([
                        "notes.id",
                        "notes.title",
                        "notes.user_id"
                    ])
                    .where("notes.user_id", user_id)
                    .whereLike("notes.title", `%${title}%`)
                    .whereIn("name", filterTags)
                    .innerJoin("notes", "notes.id", "tags.note_id")
                    .orderBy("notes.title");
            } else {
                notes = await knex("notes").where({ user_id })
                    .whereLike("title", `%${title}%`)
                    .orderBy("title");
            } 

            const userTags = await knex("tags").where({ user_id });
            const notesWithTags = notes.map( note => {
                const noteTags = userTags.filter(tag => tag.note_id === note.id);

                return {
                    ...note,
                    tags: noteTags
                };
            });

            return response.json(notesWithTags);
        } catch (error) {
            return response.status(500).json({ error: 'Ocorreu um erro ao buscar as notas.' });
        }
    }
}

module.exports = NotesController;