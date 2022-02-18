import { forwardRef, useState, ReactElement, Ref } from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import SettingsIcon from '@mui/icons-material/Settings';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import { GameMode, Settings } from '../../@types/main.d';
import { Divider, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SettingsPanelProps = {
  appSettings: Settings,
}

export default function SettingsPanel({ appSettings }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSettings = (event: SelectChangeEvent) => {
    const gameMode = (event.target.value as GameMode);
    window.Main.saveSetting('gameMode', gameMode);
  }

  const gameMode: GameMode = appSettings.gameMode || GameMode.Both;

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <SettingsIcon />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {t('Settings')}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button disabled={gameMode === GameMode.Manual}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("Saved games folder")}
              secondary={appSettings.saveDir || ''}
              onClick={() => { window.Main.openFolder() }}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("Game mode")}
              secondary={t("Select which types of games you want to include in the list")}
            />
            <FormControl>
              <Select
                // @ts-ignore
                value={gameMode}
                // @ts-ignore
                onChange={handleSettings}
              >
                <MenuItem value={GameMode.Both}>{t("Both softcore and hardcore")}</MenuItem>
                <MenuItem value={GameMode.Softcore}>{t("Only softcore")}</MenuItem>
                <MenuItem value={GameMode.Hardcore}>{t("Only hardcore")}</MenuItem>
                <MenuItem value={GameMode.Manual}>{t("Manual selection of items")}</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>
        <Grid m={{ t: 2 }} p={3}>
          <h3>{t('HTTP feed preview')}</h3>
          <p><a onClick={() => { window.Main.openUrl("http://localhost:3666/") }}>http://localhost:3666/</a></p>
          <iframe src="http://localhost:3666/" style={{ width: 300, height: 300, background: '#000', border: 0 }} />
        </Grid>
      </Dialog>
    </>
  );
}
