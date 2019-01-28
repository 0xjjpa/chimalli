import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chimalli from '../utils/chimalliAPI';
import { WrappedDialog } from './Dialog';

const EMPTY_PIECE = '0x0000000000000000000000000000000000000000000000000000000000000000';

export default class ChimalliCard extends React.Component {
  constructor(props) {
    super(props)
    const { web3, address } = this.props;
    this.state = {
      open: false,
      selectedValue: '',
      secret: '',
      piece: EMPTY_PIECE
    };
    this.API = new Chimalli(web3, address);
    this.getKeeper = this.getKeeper.bind(this);
    this.loadSecrets = this.loadSecrets.bind(this);
  }


  async componentDidMount() {
    const { API } = this;
    await this.loadSecrets();   
  }

  storePiece = () => {
    this.setState({
      open: true,
    });
  };

  async loadSecrets() {
    const { API } = this;
    const unparsedSecret = await API.getSecret();
    const [ secret, namehash ] = Object.keys(unparsedSecret).map( key => unparsedSecret[key]);
    const piece = API.getPieceFromIPFS(secret)
    console.log('[ ChimalliCard ] loadSecrets | secret', secret);
    console.log('[ ChimalliCard ] loadSecrets | piece', piece);
    this.setState({ secret, piece })
  }

  handleClose = async (piece) => {
    if (piece === "" || piece === EMPTY_PIECE ) return this.setState({ open: false });
    const { API } = this;
    const { secret } = this.props;
    this.setState({ open: false });
    console.log('[ ChimalliCard ] handleClose | piece', piece);
    const transactionReceipt = await API.storeSecret(secret, piece, alert);
    // We’ll give it a bit of time for the status to reflect before loading it
    transactionReceipt && setTimeout(this.loadSecrets, 2000);
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
    const { secret } = this.state;
    return (
      <Grid item key={address} sm={6} md={4} lg={3}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h6" component="h3">
              🛡 Chimalli #{index + 1}
            </Typography>
              { 
                secret !== EMPTY_PIECE ?
                <Typography>
                  Currently holding { secret } for you.
                </Typography>
                : 
                <Typography>
                  Currently hold no secret pieces from you. Pick “Store” to make me hold an encrypted piece.
                </Typography>
              }
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => this.getKeeper()}>
              Keeper
            </Button>
            <Button size="small" color="primary" onClick={() => this.storePiece()}>
              Store
            </Button>
            <Button size="small" color="primary" onClick={() => this.loadSecrets()}>
              Reload
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