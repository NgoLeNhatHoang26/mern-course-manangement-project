import { useState } from 'react'
import {
    Box, IconButton, Menu, MenuItem,
    Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Button
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'

export default function EditMenu({itemName, onDelete, renderEditForm, buttonSx, containerSx}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    const handleDelete = async () => {
        await onDelete?.()
        setOpenConfirm(false)
    }

    return (
        <Box sx={containerSx}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={buttonSx}>
                <MoreVert />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => { setAnchorEl(null); setOpenEdit(true) }}>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={() => { setAnchorEl(null); setOpenConfirm(true) }}
                    sx={{ color: 'error.main' }}
                >
                    Xóa
                </MenuItem>
            </Menu>

            {/* Dialog chỉnh sửa */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Chỉnh sửa</DialogTitle>
                <DialogContent>
                    {renderEditForm?.({ onClose: () => setOpenEdit(false) })}
                </DialogContent>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc muốn xóa <strong>{itemName}</strong>? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}