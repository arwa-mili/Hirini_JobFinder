import mongoose from "mongoose";




const applicationsSchema = new mongoose.Schema(

    {
        candidateName: {
            type: String,
            required: [true]
        },
        candidateSurname: {
            type: String,
            required: [true]
        },
        linkedinProfile: {
            type: String,
        },
        email: {
            type: String,
            required: [true]
        },
        coverLetter:
        {
            type: String,
        },
        pdf: {
            type: String,
            required: [true]

        },
        status: {
            type: String,



        }
    },
    {
        timestamps: true,
    }
);

const ApplicationsModel = mongoose.model("Applications", applicationsSchema);
export default ApplicationsModel;