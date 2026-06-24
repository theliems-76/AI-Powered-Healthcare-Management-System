const Joi = require('joi');

const diagnosticSchema = Joi.object({
    HighBP: Joi.number().valid(0, 1).required(),
    HighChol: Joi.number().valid(0, 1).required(),
    CholCheck: Joi.number().valid(0, 1).required(),
    BMI: Joi.number().min(10).max(100).required(),
    Smoker: Joi.number().valid(0, 1).required(),
    Stroke: Joi.number().valid(0, 1).required(),
    HeartDiseaseorAttack: Joi.number().valid(0, 1).required(),
    PhysActivity: Joi.number().valid(0, 1).required(),
    Fruits: Joi.number().valid(0, 1).required(),
    Veggies: Joi.number().valid(0, 1).required(),
    HvyAlcoholConsump: Joi.number().valid(0, 1).required(),
    AnyHealthcare: Joi.number().valid(0, 1).required(),
    NoDocbcCost: Joi.number().valid(0, 1).required(),
    GenHlth: Joi.number().min(1).max(5).required(),
    MentHlth: Joi.number().min(0).max(30).required(),
    PhysHlth: Joi.number().min(0).max(30).required(),
    DiffWalk: Joi.number().valid(0, 1).required(),
    Sex: Joi.number().valid(0, 1).required(),
    Age: Joi.number().min(1).max(13).required(),
    Education: Joi.number().min(1).max(6).required(),
    Income: Joi.number().min(1).max(8).required(),
    patientProfileId: Joi.number().optional().allow(null),
    weight_kg: Joi.any().optional(),
    height_cm: Joi.any().optional()
});

exports.validateDiagnosticInput = (req, res, next) => {
    const { error } = diagnosticSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ 
            error: "Dữ liệu khảo sát không hợp lệ. Vui lòng kiểm tra lại.", 
            details: error.details.map(err => err.message) 
        });
    }
    next();
};
