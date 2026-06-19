import { useState } from 'react'
import {
    Stack, TextField, ToggleButton,
    ToggleButtonGroup, InputAdornment, Typography,
} from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import { useDebounce } from '../../../hooks/useDebounce.js'

const LEVELS = ['Cơ bản', 'Trung bình', 'Nâng cao']

export default function CourseFilter({ onFilterChange }) {
    const [search, setSearch] = useState('')
    const [level, setLevel] = useState('')

    useDebounce(() => {
        onFilterChange({ search, level })
    }, 400, [search, level])

    return (
        <Stack spacing={1.5} mb={3}>
            <TextField
                placeholder="Tìm kiếm khoá học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                size="small"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    Lọc theo cấp độ:
                </Typography>
                <ToggleButtonGroup
                    value={level}
                    exclusive
                    onChange={(_, val) => setLevel(val ?? '')}
                    size="small"
                >
                    {LEVELS.map((lv) => (
                        <ToggleButton key={lv} value={lv} sx={{ px: 1.5 }}>
                            {lv}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>
        </Stack>
    )
}
