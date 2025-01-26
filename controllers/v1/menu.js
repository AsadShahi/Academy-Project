const menusModel= require('./../../models/menu')

exports.create = async (req, res) => {
    const { title, href, parent } = req.body;
  
    // Validate
  
    const menu = await menusModel.create({ title, href, parent });
  
    return res.status(201).json(menu);
  };


  exports.getAllInPanel = async (req, res) => {
    const menus = await menusModel.find({}).populate("parent").lean();
  
    return res.json(menus);
  };
  

exports.remove=async(req,res)=>{}

exports.getAll=async(req,res)=>{}
