import { useState } from 'react'
import {
    Stack, TextField, ToggleButton,
    ToggleButtonGroup, InputAdornment
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useDebounce } from '../../../hooks/useDebounce.js'

const LEVELS = ['Cơ bản', 'Trung bình', 'Nâng cao']

export default function CourseFilter({ onFilterChange }) {
    const [search, setSearch] = useState('')
    const [level, setLevel] = useState('')

    useDebounce(() => {
        onFilterChange({ search, level })
    }, 500, [search, level])

    return (
        <Stack spacing={2} mb={3}>
            <TextField
                placeholder="Tìm kiếm khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />

            <ToggleButtonGroup
                value={level}
                exclusive
                onChange={(_, val) => setLevel(val ?? '')}
                size="small"
            >
                {LEVELS.map((lv) => (
                    <ToggleButton key={lv} value={lv}>
                        {lv}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Stack>
    )
}