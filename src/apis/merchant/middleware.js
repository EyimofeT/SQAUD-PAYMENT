// import { custom_error } from "../../core/customerror";

export const create_merchant_middleware = async (req, res, next) => {
    try{
      
    let {name, email} = req.body;
    if(!name) throw new custom_error("name required", "02")
    if(!email) throw new custom_error("email required", "02")

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) throw new custom_error(`Invalid email - ${email}`, "04")

    next();
    }
    catch (err) {
      return res.status(400).json({
        code: 400,  
        response_code: err.code , 
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    };
  }