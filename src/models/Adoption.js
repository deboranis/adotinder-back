import { model, Schema } from 'mongoose';

const adoptionSchema = new Schema({
	pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
	protetor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	adotante: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, enum: ['pendente', 'aprovada'], required: true },
});

const Adoption = model('Adoption', adoptionSchema);
export default Adoption;
