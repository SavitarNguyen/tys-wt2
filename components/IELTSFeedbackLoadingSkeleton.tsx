"use client";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Card,
  CardContent,
  Grid,
  Skeleton,
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

interface IELTSFeedbackLoadingSkeletonProps {
  progress: number; // 0-100
  statusMessage: string;
  charsReceived: number;
}

export function IELTSFeedbackLoadingSkeleton({
  progress,
  statusMessage,
  charsReceived,
}: IELTSFeedbackLoadingSkeletonProps) {
  return (
    <Box>
      {/* Progress Bar with Status */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.main", color: "white" }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <EmojiEvents />
          <Typography variant="h6">{statusMessage}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.3)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "success.light",
            },
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          {progress}% complete • {charsReceived.toLocaleString()} characters received
        </Typography>
      </Paper>

      {/* Skeleton for Tabs */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width="25%" height={64} />
          <Skeleton variant="rectangular" width="25%" height={64} />
          <Skeleton variant="rectangular" width="25%" height={64} />
          <Skeleton variant="rectangular" width="25%" height={64} />
        </Stack>
      </Paper>

      {/* Skeleton Content */}
      <Box sx={{ mt: 2 }}>
        {/* Band Scores Skeleton */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="30%" />
        </Paper>

        <Grid container spacing={2} mb={3}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                  </Stack>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Strengths & Improvements Skeleton */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
              <Skeleton variant="text" width="50%" height={32} />
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Stack key={i} direction="row" spacing={1} mb={1}>
                    <Skeleton variant="circular" width={6} height={6} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="90%" />
                  </Stack>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
              <Skeleton variant="text" width="50%" height={32} />
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Stack key={i} direction="row" spacing={1} mb={1}>
                    <Skeleton variant="circular" width={6} height={6} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="90%" />
                  </Stack>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
