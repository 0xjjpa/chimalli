import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import SecurityIcon from '@material-ui/icons/Security';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import getWeb3 from "./utils/getWeb3";

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  cardAddress: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: localStorage.getItem('users') || [],
      web3: null,
      accounts: null
    }
    this.loadUsersFromWeb3 = this.loadUsersFromWeb3.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      console.log('[ ComponentDidMount ] Accounts', accounts);
      this.setState({ web3, accounts });
    } catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  loadUsersFromWeb3() {
    const { accounts } = this.state;
    const account = { address: accounts[0] }
    const users = [ account ].concat(localStorage.getItem('users') || []) 
    this.setState({ users })
    console.log('[ loadUsersFromWeb3 ] Users', users);
  }
  
  render () {
    const { classes } = this.props;
    const { users } = this.state;

    const rendereableUsers = (users) => users.map(user => (
      <Grid item key={user.address} sm={6} md={4} lg={3}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h6" component="h3">
              Address
            </Typography>
            <Typography>
              <pre className={classes.cardAddress}>{ user.address }</pre>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              View Keys
            </Button>
            <Button size="small" color="primary">
              Encrypt Secret
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))

    const messageUserCard = (message) =>
    <Grid item sm={6} md={4} lg={3}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            { message.title }
          </Typography>
          <Typography>
            { message.content }
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <SecurityIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap>
              Chimalli
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Chimalli
              </Typography>
              <Typography variant="h6" align="center" color="textSecondary" paragraph>
                Chimalli is an experiment for showcasing how decentralised backups can be made using
                PGP encryption and Shamir's Secret Sharing algorithm on top of the Ethereum network.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => this.loadUsersFromWeb3()}>
                      Connect metamask user
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary">
                      Generate users PGP keypairs
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={40} justify={ users.length <= 3 ? "center" : "flex-start" }>
              {
                rendereableUsers(users)
              }
              {
                users.length === 0 ?
                  messageUserCard({ title: 'No accounts connected', content: 'Please pick an account from metamask, and connect via the “Connect Metamask User” button.' }) :
                  users.length <= 4 && messageUserCard({ title: 'Not enough accounts', content: 'Please have at least 4 accounts in Metamask to use the applcation.' })
              }
            </Grid>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
          A project by @jjperezaguinaga made with ❤️  from 🇲🇽
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Consensys Academy 2019 Final Project Submission
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);