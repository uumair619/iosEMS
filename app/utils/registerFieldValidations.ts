export const validateFullName = (fullName) => {
    if(!fullName){
        console.log("🚀 ~ file: registerFieldValidations.ts:2 ~ validateFullName ~ fullName:", fullName)
        return "Full name is required"
    }
    
    if (!fullName.trim()) {
        return "Full Name is required";
    }
    return null;
};

export const validateAuthEmail = (authEmail) => {
    if(!authEmail){
        console.log("🚀 ~ file: registerFieldValidations.ts:11 ~ validateAuthEmail ~ authEmail:", authEmail)
        return "Full name is required"
    }
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!authEmail.trim()) {
        return "Email is required";
    } else if (!emailPattern.test(authEmail)) {
        return "Invalid email format";
    }
    return null;
};

export const validatePassword = (authPassword) => {
    if(!authPassword){
        console.log("🚀 ~ file: registerFieldValidations.ts:22 ~ validatePassword ~ authPassword:", authPassword)
        return "Full name is required"
    }
    if (!authPassword.trim()) {
        return "Password is required";
    } else if (authPassword.length < 6) {
        return "The password must be at least 6 characters";
    }
    return null;
};
