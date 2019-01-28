import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chimalli from '../utils/chimalliAPI';
import { WrappedDialog } from './Dialog';

export default class ChimalliCard extends React.Component {
  constructor(props) {
    super(props)
    const { web3, address } = this.props;
    this.state = {
      open: false,
      selectedValue: '',
    };
    this.API = new Chimalli(web3, address);
    this.getKeeper = this.getKeeper.bind(this);
  }

  storePiece = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    console.log('Selected Value', value);
    this.setState({ selectedValue: value, open: false });
  };

  async getKeeper() {
    const { API } = this;
    console.log('API', API);
    const keeper = await API.getKeeper();
    alert(`My keeper is ${keeper}`);
    return keeper;
  }
  render() {
    const { address, classes, index } = this.props;
    return (
      <Grid item key={address} sm={6} md={4} lg={3}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h6" component="h3">
              🛡 Chimalli #{index + 1}
            </Typography>
            <Typography>
              Currently hold no secret pieces from you. Pick “Store” to make me hold an encrypted piece.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => this.getKeeper()}>
              Keeper
            </Button>
            <Button size="small" color="primary" onClick={() => this.storePiece()}>
              Store
            </Button>
            <Button size="small" color="primary">
              Request
            </Button>
          </CardActions>
        </Card>
        <WrappedDialog
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onClose={this.handleClose}
          pieces={this.props.pieces || []}
        />
      </Grid>
    )
  }
}