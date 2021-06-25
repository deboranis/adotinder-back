import { model, Schema } from 'mongoose';

function isCat() {
	return this.especie === 'gato';
}

const petSchema = new Schema({
	nome: { type: String, required: true },
	especie: { type: Boolean, required: true },
	descricao: { type: String, required: true },
	idade: { type: Number, required: true }, //
	sexo: { type: Boolean, required: true },
	peso: { type: Number, required: true },
	castrado: { type: Boolean, required: true },
	vacinas: { type: Boolean, required: true },
	vermifugo: { type: Boolean, required: true },
	socializaAnimais: { type: Boolean, required: true }, //
	socializaCriancas: { type: Boolean, required: true }, //
	fiv: { type: Boolean, required: isCat }, //
	felv: { type: Boolean, required: isCat }, //
	protetor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	foto: { type: String },
	// aqui dizendo que o protetor vai ter como tipo um objectId que por sua vez tem como referência o user
});

const Pet = model('Pet', petSchema);
export default Pet;
