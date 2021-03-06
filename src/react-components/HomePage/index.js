import React from 'react';
import ProductList from '../Product/ProductList';

import connectToStores from 'alt-utils/lib/connectToStores';
import ProductStore from '../../stores/ProductStore';
import Actions from '../../actions';

@connectToStores
class HomePage extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   productList: []
    // }
    //
    // Firebase.database().ref('products').on('value', (snapshot) => {
    //   var products = snapshot.val();
    //
    //   this.setState({
    //     productList: products
    //   })
    // });
    Actions.getProducts();
  }

  static getStores() {
    return [ProductStore];
  }

  static getPropsFromStores() {
    return ProductStore.getState();
  }

  render() {
    return (
      <section>
        <header>
          <img src="/img/banner.jpeg" width="100%" />
        </header>

        <section>
          <section className="container">
            {
              this.props.products
              ?
              <ProductList productList={this.props.products}/>
              :
              null
            }
          </section>
        </section>

        <header>
          <img src="/img/banner.jpeg" width="100%" />
        </header>

        <section>
          <section className="container">
            {
              this.props.products
              ?
              <ProductList productList={this.props.products}/>
              :
              null
            }
          </section>
        </section>


      </section>
    );
  }
}

export default HomePage;
