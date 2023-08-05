import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Snackbar, Tooltip } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DirectShareModal from '../modals/DirectShareModal';

interface MenuParameters {
  password: string;
  username: string;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//props for the menu

export default function CustomizedMenus({
  password,
  username,
}: MenuParameters) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [openDirectShareModal, setOpenDirectShareModal] = React.useState(false);
  // const [shareLink, setShareLink] = React.useState('');
  // const [openLinkShareModal, setOpenLinkShareModal] = React.useState(false);

  const open = Boolean(anchorEl);

  // handlers of the menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handler of snackbar
  const handleSnackbarClose = (
    e?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // handler of copy
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setSnackbarOpen(true);
    handleClose();
  };

  const handleDirectShareModalOpen = () => {
    setOpenDirectShareModal(true);
  };

  // handler of link share modal
  // const handleLinkShareModalOpen = () => {
  //   setOpenLinkShareModal(true);
  // };

  // handler of link share
  // const handleLinkShare = () => {
  //   handleLinkShareModalOpen();

  //   const vaultKey = getVaultKey();

  //   const encryptedSharedPassword = encryptVault({
  //     vaultPassword: password,
  //     vaultKey: vaultKey,
  //   });

  //   authorizedFetch('http://localhost:4000/api/vault/shared', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ password: encryptedSharedPassword }),
  //   })
  //     .then((res) => res.text())
  //     .then((data) => {
  //       setShareLink(data);
  //     })
  //     .catch((err: any) => {
  //       throw new Error(err);
  //     });

  //   handleClose();
  // };

  //handle direct share

  return (
    <div>
      {/* <LinkShareModal
        open={openLinkShareModal}
        setOpenModal={setOpenLinkShareModal}
        data={shareLink}
      /> */}

      <DirectShareModal
        open={openDirectShareModal}
        setOpenModal={setOpenDirectShareModal}
        ModalData={{ password, username } as MenuParameters}
      />

      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Password Copied to Clipboard
        </Alert>
      </Snackbar>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCopyToClipboard}>
          <FileCopyIcon />
          Copy Password
        </MenuItem>

        {/* <Tooltip title="Share password with non-users" arrow>
          <MenuItem onClick={handleLinkShare}>
            <SendIcon />
            Share Via Link
          </MenuItem>
        </Tooltip> */}

        <Tooltip title="Share password with other users" arrow>
          <MenuItem onClick={handleDirectShareModalOpen}>
            <SendIcon />
            Direct Share
          </MenuItem>
        </Tooltip>

        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
