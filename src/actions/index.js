import alt from '../alt';
import Firebase from 'firebase';
import _ from 'lodash';


var config = {
     apiKey: "AIzaSyC36tkrBZyELpzhBQgF82Ibiflj8jC0yDY",
     authDomain: "matyneemenu-12355.firebaseapp.com",
     databaseURL: "https://matyneemenu-12355.firebaseio.com",
     storageBucket: "matyneemenu-12355.appspot.com",
};

Firebase.initializeApp(config);

class Actions {

  initSession() {
    return (dispatch) => {

      Firebase.auth().onAuthStateChanged(function(result) {
        var profile = null;

        if (result) {
          profile = {
            id: result.uid,
            name: result.providerData[0].displayName,
            avatar: result.providerData[0].photoURL
          }
        }

        dispatch(profile);
      });
    }
  }

  login() {
    return (dispatch) => {
      var provider = new Firebase.auth.FacebookAuthProvider();
      Firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;

        var profile = {
          id: user.uid,
          name: user.providerData[0].displayName,
          avatar: user.providerData[0].photoURL
        }

        Firebase.database().ref('/users/'+user.uid).set(profile);
        dispatch(profile);

      }).catch(function(error) {
        console.log('Failed!', error);
      });
    }
  }

  logout() {
    return(dispatch) => {
      Firebase.auth().signOut().then(function() {
        // Sign-out successful.
        dispatch(null);
      }, function(error) {
        // An error happened.
        console.log(error);
      });
    }
  }

  getProducts() {
    return(dispatch) => {
      Firebase.database().ref('products').on('value', function(snapshot) {
        var productsValue = snapshot.val();
        var products = _(productsValue).keys().map((productKey) => {
          var item = _.clone(productsValue[productKey]);
          item.key = productKey;
          return item;
        })
        .value();
        dispatch(products);
      });
    }
  }

  addProduct(product) {
    return (dispatch) => {
      Firebase.database().ref('products').push(product);
    }
  }

  addVote(productId, userId) {
    return (dispatch) => {
      var voteRef = Firebase.database().ref('votes/'+productId+'/'+userId);
      var upvoteRef = Firebase.database().ref('products/'+productId+'/upvote');

      voteRef.on('value', function(snapshot) {
        if(snapshot.val() == null) {
          voteRef.set(true);

          var vote = 0;
          upvoteRef.on('value', function(snapshot) {
            vote = snapshot.val();
          });
          upvoteRef.set(vote+1);
        }
      });
    }
  }

  addComment(productId, comment) {
    return (dispatch) => {
      Firebase.database().ref('comments/'+productId).push(comment);
    }
  }

  getComments(productId) {
    return (dispatch) => {
      var commentRef = Firebase.database().ref('comments/'+productId);

      commentRef.on('value', function(snapshot) {
        var commentsValue = snapshot.val();
        var comments = _(commentsValue).keys().map((commentKey) => {
          var item = _.clone(commentsValue[commentKey]);
          item.key = commentKey;
          return item;
        })
        .value();
        dispatch(comments);
      });
    }
  }

}

export default alt.createActions(Actions);
