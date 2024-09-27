import './AdminDashBoard.css'; 
import React, { useState, useEffect } from 'react';
import Base from '../Base';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Service from '../Service/CategoryService';
import productService from '../Service/productService';
import Toastify from '../ToastNotify/Toastify';
import ImageUploader from './ImageUploader'
import { Helmet } from "react-helmet";
import clsx from 'clsx';

function AdminDashBoard() {

  const [count , setCount]=useState(0)
  const [productList,setProductList]=useState([]); 
  const [showSidebar, setShowSidebar] = useState(false);
//passing id to add image
const [imageId , setImageId]=useState();

  
  const [categoryList, setCategoryList] = useState([]);
  const [catId, setCatId] = useState(3);
  const [updateCategory, setUpdateCategory] = useState({ categoryId: '', title: '' });
  const [isEditMode, setIsEditMode] = useState(false); // To differentiate between add and update
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [searchProduct, setSearchProduct] = useState(''); 

  
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
};


  const [AddProductFormData, setAddProductFormData] = useState({
    productName: '',
    productPrize: null,
    productQuantity: null,
    productDesc: '',
    live: null,
    stock: null,
    categoryId: 'none',
});


  useEffect(() => {
    if (catId > 0 && isEditMode) { 
      Service.loadCategoryById(catId)
        .then((res) => {
          setUpdateCategory(res.data);
        })
        .catch((error) => {
          console.error(error); 
        });
    }
  }, [catId, isEditMode]); 

  




  {/*-----------------fetching----------------------*/}
  useEffect(() => {
    loadCategory();
    loadProduct();
  }, []);

  const loadCategory = () => {
    Service.loadCategory()
      .then(response => {
        setCategoryList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadProduct = () => {
    productService.getAllProductsDetails().then((res) => {
      console.log(res.data);
      setProductList(res.data.content);
    }).catch((error) => {
      console.log("Error fetching products", error);
    });
  };
  
  // To check the `productList` state
  console.log(productList);
// Filter products by `productName` and `category.title`
const filteredProduct = productList.filter((product) => {
  return (
    product.productName.toLowerCase().includes(searchProduct.toLowerCase()) || // Filter by productName
    product.category.title.toLowerCase().includes(searchProduct.toLowerCase()) // Filter by category title
  );
});

  
  
  {/*-----------------fetching closed----------------------*/}

   {/*-----------------category----------------------*/}
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setUpdateCategory({ ...updateCategory, [name]: value });
  };

  const handleUpdate = () => {
    if(updateCategory.categoryId ==="" &&  updateCategory.title ===""){
      Toastify.showErrorMessage("Please fill all required fields !")
    }else{
      const updateAction = isEditMode 
      ? Service.updateCategory(updateCategory.categoryId, updateCategory)
      : Service.addCategory(updateCategory); 

    updateAction
      .then((response) => {
        Toastify.showSuccessMessage(isEditMode ? "Category updated!" : "Category added!");
        loadCategory(); 
        handleCloseCategoryModal();  
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
    }
    

  const handleCloseCategoryModal = () => setShowCategoryModal(false);
  const handleShowAddModal = () => {
    setIsEditMode(false);
    setUpdateCategory({ categoryId: '', title: '' }); 
    setShowCategoryModal(true);
  };
  const handleShowEditModal = (categoryId) => {
    setIsEditMode(true);
    setCatId(categoryId);
    setShowCategoryModal(true);
  };

  const filteredCategories = categoryList.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCategoryDelete = () => {
    Service.deleteCategory(catId)
      .then((response) => {
        Toastify.showSuccessMessage("Deleted Successfully!");
        loadCategory(); 
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage("Something Went Wrong!");
      });
  };
  
  

{/*-------------------------------------product--------------------------------------*/}
const handleAddProduct = (e) => {
  e.preventDefault();
  const { name, value, type, checked } = e.target;
  setAddProductFormData({
    ...AddProductFormData,
    [name]: type === 'checkbox' ? checked : value
  });
};

const AddProductData = (e) => {
  e.preventDefault();  
  productService.addProduct(AddProductFormData, AddProductFormData.categoryId)
  .then((res) => {
      Toastify.showSuccessMessage("Product added successfully!");
      setAddProductFormData(res.data);
      loadProduct();
  }).catch((error) => {
      Toastify.showErrorMessage("Error adding product");
  });
}


 //viewing individual product
const [productToView , setProductToView]=useState();
 const viewProduct = (id) => {
   setCount(4);
   productService.getProductById(id).then((res)=>{
    console.log(res.data);
    setProductToView(res.data)
   }).catch((err)=>{
    console.log(err);
   })
 }


 //deleting product by id
 const deleteProduct = (id) => {
  productService.deleteProductById(id).then((res) => {
    console.log(res.data);
    loadProduct();
    Toastify.showSuccessMessage("Product deleted successfully!");
    }).catch((error) => {
      console.log(error);
      Toastify.showErrorMessage("Error deleting product");
      });
    }
  return (
    <>
      <div className='wrapper'>
        {/* Sidebar and Main Body */}
        <div id="sideBar" className={`sideBar ${showSidebar ? 'expanded' : ''}`}>
        <div className="sidebar-header">
        <h4>Admin Dashboard</h4>
      </div>
      <ul className="sideBar-body">
        <li className='titles'>
          <i className="fas fa-tachometer-alt" style={{ backgroundColor: 'transparent', fontSize: '1rem' }}></i>
          &nbsp;Dashboard
        </li>

        {/* Manage Category */}
        <li onClick={()=>{setCount(1)}} className='titles'>
          <i className="fas fa-sitemap" style={{ backgroundColor: 'transparent', fontSize: '1rem' }}></i>
          &nbsp;Manage Category
        </li>
       {/* {showCategory && (
          <ul className='subMenu'>
            <li><a href="#">Add Category</a></li>
            <li><a href="#">View Category</a></li>
            <li><a href="#">Update Category</a></li>
          </ul>
       )}*/}

        {/* Manage Products */}
        <li onClick={() => setCount(0)} className='titles'>
          <i className="fas fa-boxes" style={{ backgroundColor: 'transparent', fontSize: '1rem' }}></i>
          &nbsp;Manage Products
        </li>
    
       { /*  <ul className='subMenu'>
          <li><a href="#">View Products</a></li>
          <li><a  href="#">Add Products</a></li>
            <li><a   href="#">Upload Product Image</a></li>
          </ul>*/}
  

        {/* Orders */}
       <li  className='titles'>
          <i className="fas fa-shopping-cart" style={{ backgroundColor: 'transparent', fontSize: '1rem' }}></i>
          &nbsp;Orders
        </li>
       
         {/* <ul className='subMenu'>
            <li><a href="#">View Orders</a></li>
            <li><a href="#">Update Orders</a></li>
          </ul>*/}


        {/* Users */}
        <li  className='titles'>
          <i className="fas fa-users" style={{ backgroundColor: 'transparent', fontSize: '1rem' }}></i>
          &nbsp;Users
        </li>
      
         {/* <ul className='subMenu'>
            <li><a href="#">View Users</a></li>
            <li><a href="#">Update Users</a></li>
          </ul>*/}
    
      </ul>
        </div>
        <div className='main-body'>
        <div className='main-header'>
          <ul>
            <li onClick={toggleSidebar} className='btn btn-outline-dark'>
              <i className={`fas fa-arrow-${showSidebar ? 'left' : 'right'}`} style={{ backgroundColor: 'transparent' }}></i>
            </li>
            <li><a href='/'>Store</a></li>
            <li><a href='/UserDashboard'>Account</a></li>
            <li><a href='/'>Logout</a></li>
          </ul>
          <ul>
            <li>Good Morning,&nbsp; Madhu Damodhar</li>
          </ul>
        </div>
  
      
               {/*fetch------------------product*/}
          <div className='main-section'>
           
          { count===0 && ( <div className='view-product'>
            <h2 style={{ textAlign: 'center' }}>Available Products</h2>
            <ul className='view-product-header'>
              <li style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <input 
                  type='search' 
                  placeholder='Enter product name...' 
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <li id='view-product-search-btn' className='btn btn-dark'>
                  <i style={{ fontSize: '1rem', color: 'white', backgroundColor: 'transparent' }} className="fas fa-search"></i>
                </li>
              </li>

              <li onClick={() => setCount(2)} id='view-product-add-btn' className='btn btn-dark'>
                Add &nbsp; <i style={{ fontSize: '.8rem', color: 'white', backgroundColor: 'transparent' }} className="fas fa-plus"></i>
              </li>
            </ul>
            <ul className='view-product-records'>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:''}} >Id</li>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:'auto'}}>Name</li>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:'auto'}}>Price</li>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:'auto'}}>Quantity</li>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:'auto'}}>Live</li>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:'auto'}}>Stock</li>
            <li style={{fontSize:'15px' , fontWeight:'600' ,padding:'auto'}}>Desc</li>
            <li style={{visibility:'hidden'}}>
            <Button  id='imageAdd-btn' style={{
              height:'35px' 
            }}   variant='outline-primary'>View</Button>
              <Button  variant='outline-dark'>Update</Button>
              
              <Button  variant='outline-danger'>Delete</Button>
              <Button   id='imageAdd-btn' style={{
                height:'35px' 
              }}  variant='success'> <i style={{ fontSize: '.8rem', color: 'white', backgroundColor: 'transparent' }} className="fas fa-plus"></i>&nbsp;img</Button>
              
            </li>
          </ul>
            {filteredProduct.map((product, index) => (
              <ul className='view-product-records' key={index}>
                <li >{product.productId}</li>
                <li >{product.productName}</li>
                <li >{product.productPrize}</li>
                <li >{product.productQuantity}</li>
                <li >{product.live ? 'Yes' : 'No'}</li>
                <li >{product.stock ? 'Yes' : 'No'}</li>
                <li >...{product.productDesc.slice(0 ,0)}</li>
                <li>
                <Button onClick={()=>{viewProduct(product.productId)}}  id='imageAdd-btn' style={{
                  height:'35px' 
                }}  variant='outline-success'>View</Button>

                <Button onClick={()=>{setCount(3)
                  setImageId(product.productId)
                }}   id='imageAdd-btn' style={{
                  height:'35px' 
                }}  variant='success'> <i style={{ fontSize: '.8rem', color: 'white', backgroundColor: 'transparent' }} className="fas fa-plus"></i>&nbsp;img</Button>
                  <Button style={{
                    height:'35px' 
                  }}  variant='outline-dark'>Update</Button>
                 
                  <Button onClick={()=>{deleteProduct(product.productId)}}  variant='outline-danger'>Delete</Button>

                
                </li>
              </ul>
            ))}
          </div>)}

           {/*fetch------------------category*/}
          { count===1 && ( <div className='view-categories'>
            <h2 style={{ textAlign: 'center' }}>Available Categories</h2>
            <ul className='category-header'>
              <li style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <input 
                  type='search' 
                  placeholder='Enter category name...' 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <li id='search-btn' className='btn btn-dark'>
                  <i style={{ fontSize: '1rem', color: 'white', backgroundColor: 'transparent' }} className="fas fa-search"></i>
                </li>
              </li>

              <li id='add-btn' className='btn btn-dark' onClick={handleShowAddModal}>
                Add &nbsp; <i style={{ fontSize: '.8rem', color: 'white', backgroundColor: 'transparent' }} className="fas fa-plus"></i>
              </li>
            </ul>

            {filteredCategories.map((category, index) => (
              <ul className='records' key={index}>
                <li>{category.categoryId}</li>
                <li>{category.title}</li>
                <li>
               
                  <Button onClick={() => handleShowEditModal(category.categoryId)} variant='outline-dark'>Update</Button>
                  <Button onClick={() => {
                    setCatId(category.categoryId);
                    handleCategoryDelete(); 
                  }} variant='outline-danger'>Delete</Button>

                  
                </li>
              </ul>
            ))}
          </div>)}

            {/*manage----------------------------product*/}
          {count ===2 && (
            <div className='manage-product'>
            
            <form onSubmit={(e)=> AddProductData(e)} class="manage-product-form">
            <p class="manage-product-form-title">Add Products </p>
            <p class="manage-product-form-message">Please fill in the form below to add a new product to the database.</p>
            <label>
            <input class="manage-product-form-input" type="text" 
            onChange={(e)=>handleAddProduct(e)}
            value={AddProductFormData.productName}
            name='productName'
            placeholder="" required=""/>
                <span>Product Name</span>
            </label> 
                <div class="manage-product-form-flex">
                <label style={{width:'100%'}}>

                    <input  class="manage-product-form-input" type="number"
                    onChange={(e)=>handleAddProduct(e)}
                    value={AddProductFormData.productPrize}
                    name='productPrize'
                    placeholder="" required=""/>
                    <span>Product Price ( ₹ )</span>
                </label>
        
                <label style={{width:'100%'}} >
                    <input class="manage-product-form-input" type="number" 
                    name="productQuantity"
                    value={AddProductFormData.productQuantity}
                     placeholder="" 
                     onChange={(e)=>handleAddProduct(e)}
                     required=""/>
                    <span>Product Quantity</span>
                </label>
            </div>  
            <label>
            <input class="manage-product-form-input" type="text" 
            value={AddProductFormData.productDesc}
            name='productDesc'
            onChange={(e)=>handleAddProduct(e)}
            placeholder="" required=""/>
                <span>Product Description</span>
            </label>
            <div class="manage-product-form-flex-checkboxes">
            <label>
                <input class="manage-product-form-input-checkbox" type="checkbox" 
                name='live'
                checked={AddProductFormData.live}
                placeholder=""
                onChange={(e)=>handleAddProduct(e)} 
                required=""/>
                <span>Product Live</span>
            </label>
            <label >
            <input class="manage-product-form-input-checkbox" type="checkbox" 
            name='stock'
            checked={AddProductFormData.stock}
            placeholder="" 
            onChange={(e)=>handleAddProduct(e)}
            required=""/>
            <span>Product Stock</span>
        </label>
        </div>  
        <select className='select' name="categoryId" value={AddProductFormData.categoryId} onChange={(e)=>handleAddProduct(e)}>
        <option value="none">None</option>
        {categoryList.map((category) => {
            return (
                <option key={category.categoryId} value={category.categoryId}>
                    {category.title}
                </option>
            );
        })}
    </select>
    
      
            <button class="manage-product-form-submit">Submit</button>
            <button onClick={()=>{setCount(0)}} class="manage-product-form-submit">Back</button>
         
        </form>
            </div>

          )}
              {/*image----------------------------product*/}
          {count === 3 &&(
            <div style={{ textAlign: 'center' }}>
            <h1>Product Image Upload</h1>
            <div>
              <ImageUploader id={imageId} />
            </div>
            <button onClick={()=>{setCount(0)}} class="manage-product-form-submit">Back</button>
          </div>
          )}
          {
            count ===4 &&(
        
<section class="box">
<div class="content">

  <div class="left">
  <div className="product_img">
  <img 
    src={productToView && productToView.imageName ? productToView.imageName : "https://via.placeholder.com/100"} 
    alt='' 
  />
 
</div>

<h4 style={{textAlign:'center' ,fontWeight:'600'}}>{productToView && productToView.productName ? productToView.productName : "Product Name"}</h4>   
  </div>

  <div class="right">
    <div class="product_description">
      <h4 style={{
        fontSize:'18px',fontWeight:'600'
      }} >{productToView && productToView.productDesc ? productToView.productDesc : "Product Description"}</h4>

      <p>Price :  ₹ &nbsp;{productToView && productToView.productPrize ? productToView.productPrize : "Product Prize"}
      </p>
      <p><span class="highlight">Quantity - </span>
      {productToView && productToView.productQuantity ? productToView.productQuantity : "Product Quantity"} 
      </p>
      <p><span class="highlight">Category -</span>
       <span class="special">{productToView && productToView.productQuantity ? productToView.category.title : "Product Quantity"}</span>
      </p>
      <p><span class="highlight">Live - </span> {productToView && productToView.live ? "True" : "False"}
      </p>
      <p><span class="highlight">Stock -</span> {productToView && productToView.stock ? "In Stock" : "Out Of Stock"}
      </p>
      <p><span class="highlight">Product Id -</span> {productToView && productToView.productId ? productToView.productId : "Product Id"}
      </p>
      <Button style={{width:'300px'}} variant='dark' onClick={()=>{setCount(0)}}>Back</Button>
    </div>
   
  </div>
  
</div>
</section>

            )
           }
          </div>
        </div>
      </div>
      
      {/* Modal for adding/updating category */}
      <Modal className='modal' show={showCategoryModal} onHide={handleCloseCategoryModal}
      backdrop="static"
      >
        <Modal.Header className='modal-header'>
          <Modal.Title className='modal-title'><h2>{isEditMode ? '* * *' : '* * *'}</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body  className='modal-body' >
          <form  onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <h2>{isEditMode ? 'Update Category' : 'Add Category'}</h2>
          <input 
          type='number' 
          name="categoryId" 
          value={updateCategory.categoryId} 
          onChange={handleCategoryChange} 
          placeholder='Enter Category Id' 
        />
            <input 
              type='text' 
              name="title" 
              value={updateCategory.title} 
              onChange={handleCategoryChange} 
              placeholder='Enter Category Name' 
            />
            <Button variant="outline-dark" type="submit">
              {isEditMode ? 'Update' : 'Add'}
            </Button>
            <Button variant="danger" onClick={handleCloseCategoryModal}>
            Close
          </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <h2>* * *</h2>
        </Modal.Footer>
      </Modal>
      <Helmet>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
      rel="stylesheet"
    />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
  </Helmet>
    </>
  );
}

export default AdminDashBoard;
