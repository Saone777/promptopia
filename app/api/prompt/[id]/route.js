import Prompt from "@models/prompt"; // Import the Prompt model
import { connectToDB } from "@utils/database"; // Import the database connection utility

// GET request to fetch a prompt by ID
export const GET = async (request, { params }) => {
    try {
        await connectToDB(); // Connect to the database

        const prompt = await Prompt.findById(params.id).populate("creator"); // Find the prompt and populate the creator field
        if (!prompt) return new Response("Prompt Not Found", { status: 404 }); // Handle case where prompt is not found

        return new Response(JSON.stringify(prompt), { status: 200 }); // Return the found prompt as JSON
    } catch (error) {
        console.error("Error fetching prompt:", error); // Log the error for debugging
        return new Response("Internal Server Error", { status: 500 }); // Handle server error
    }
};

// PATCH request to update a prompt by ID
export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json(); // Parse JSON request body

    try {
        await connectToDB(); // Connect to the database

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);
        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 }); // Handle case where prompt is not found
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save(); // Save the updated prompt

        return new Response("Successfully updated the Prompt", { status: 200 }); // Return success message
    } catch (error) {
        console.error("Error updating prompt:", error); // Log the error for debugging
        return new Response("Error Updating Prompt", { status: 500 }); // Handle server error
    }
};

// DELETE request to remove a prompt by ID
export const DELETE = async (request, { params }) => {
    try {
        await connectToDB(); // Connect to the database

        // Find the prompt by ID and remove it
        const deletedPrompt = await Prompt.findByIdAndRemove(params.id);
        if (!deletedPrompt) {
            return new Response("Prompt not found", { status: 404 }); // Handle case where prompt is not found
        }

        return new Response("Prompt deleted successfully", { status: 200 }); // Return success message
    } catch (error) {
        console.error("Error deleting prompt:", error); // Log the error for debugging
        return new Response("Error deleting prompt", { status: 500 }); // Handle server error
    }
};
