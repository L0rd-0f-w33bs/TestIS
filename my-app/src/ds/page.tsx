import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { supabase } from "../database/supabase";

export default function DS() {
  const [review, setReview] = React.useState<
    {
      id: number;
      positive: boolean;
      predict_positive: boolean;
      tag: string[];
      review: string;
    }[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("review").select();
        setReview(data!);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-8 px-14 flex flex-col">
      <p className="font-semibold text-2xl mb-8">
        Showing recent <span className="italic">Reviews</span>
      </p>

      <BasicTable review={review} />
    </div>
  );
}

function BasicTable({
  review,
}: {
  review: {
    id: number;
    positive: boolean;
    tag: string[];
    review: string;
    predict_positive: boolean;
  }[];
}) {
  return (
    <TableContainer component={Paper} className="border">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User Review</TableCell>
            <TableCell align="center" className="w-[150px]">
              Review Status
            </TableCell>
            <TableCell align="center" className="w-[200px]">
              Classifed Status
            </TableCell>
            <TableCell align="left" className="w-[350px]">Classified Tags</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {review.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.review}
              </TableCell>
              <TableCell align="center">
                {row.positive ? "Yes" : "No"}
              </TableCell>
              <TableCell align="center">
                {row.predict_positive ? "Yes" : "No"}
              </TableCell>
              <TableCell align="left">
                {row.tag.map((item, index) => {
                  return (
                    <span>
                      "{item}"
                      {index + 1 === row.tag.length ? "" : ", "}
                    </span>
                  );
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
