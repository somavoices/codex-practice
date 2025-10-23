import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import type { BorrowRequest, Book, User } from "@prisma/client";
import type { RequestStatus } from "@/backend/models/requestStatus";

type RequestItem = BorrowRequest & {
  requester: Pick<User, "id" | "name" | "email">;
  book: Pick<Book, "id" | "title" | "ownerId">;
};

type Props = {
  requests: RequestItem[];
  onStatusChange?: (requestId: string, status: RequestStatus) => void;
};

const STATUS_COLOR: Record<RequestStatus, "warning" | "success" | "error" | "info"> = {
  PENDING: "warning",
  APPROVED: "success",
  DECLINED: "error",
  RETURNED: "info"
};

export function BorrowRequestList({ requests, onStatusChange }: Props) {
  if (requests.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderStyle: "dashed",
          bgcolor: "rgba(124,77,255,0.04)",
          color: "text.secondary"
        }}
      >
        No borrow requests yet. Sharing more books will draw in readers.
      </Paper>
    );
  }

  return (
    <Stack spacing={2.5}>
      {requests.map((req) => {
        const initials =
          req.requester.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase() ??
          req.requester.email[0]?.toUpperCase() ??
          "U";

        return (
          <Paper
            key={req.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(124,77,255,0.12)",
              bgcolor: "background.paper"
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}>
                  {initials}
                </Avatar>
                <div>
                  <Typography variant="subtitle1">
                    {req.requester.name ?? req.requester.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {req.requester.email}
                  </Typography>
                </div>
              </Stack>
              <Chip
                label={req.status}
                color={STATUS_COLOR[req.status]}
                variant="outlined"
                sx={{ fontWeight: 600 }}
                data-testid="request-status"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: req.message ? 2 : 0 }}>
              Requesting{" "}
              <Typography component="span" fontWeight={600}>
                {req.book.title}
              </Typography>
            </Typography>

            {req.message && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: "rgba(124,77,255,0.2)",
                  bgcolor: "rgba(124,77,255,0.05)"
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  “{req.message}”
                </Typography>
              </Paper>
            )}

            {onStatusChange && (
              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 3 }}>
                {(["PENDING", "APPROVED", "DECLINED", "RETURNED"] as RequestStatus[]).map(
                  (status) => (
                    <Button
                      key={status}
                      variant={status === req.status ? "contained" : "outlined"}
                      color="primary"
                      size="small"
                      onClick={() => onStatusChange(req.id, status)}
                    >
                      {status}
                    </Button>
                  )
                )}
              </Stack>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
}
