import { model, Schema } from 'mongoose';

function isCat() {
	return this.especie === 'gato';
}

const petSchema = new Schema({
	nome: { type: String, required: true },
	especie: { type: String, required: true, enum: ['gato', 'cachorro'] },
	idade: { type: Number, required: true },
	castrado: { type: Boolean, required: true },
	vacinas: { type: Boolean, required: true },
	fiv: { type: Boolean, required: isCat },
	felv: { type: Boolean, required: isCat },
});

const Pet = model('Pet', petSchema);
export default Pet;
